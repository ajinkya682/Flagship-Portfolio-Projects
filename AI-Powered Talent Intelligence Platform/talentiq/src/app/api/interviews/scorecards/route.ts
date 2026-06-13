export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing token" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "super_secret_jwt_key_for_dev_only"
    );

    let decoded;
    try {
      const result = await jwtVerify(token, secret);
      decoded = result.payload as any;
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { interviewId, overallRating, notesText, ratings } = await req.json();

    if (!interviewId || !overallRating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify interview exists and user belongs to the company
    const interview = await prisma.interview.findUnique({
      where: { id: interviewId }
    });

    if (!interview || interview.companyId !== decoded.companyId) {
      return NextResponse.json({ error: "Interview not found" }, { status: 404 });
    }

    const scorecard = await prisma.interviewScorecard.create({
      data: {
        companyId: decoded.companyId,
        interviewId,
        submittedById: decoded.userId,
        overallRating,
        notesText,
        ratings: {
          create: ratings // expects array of { criterion, rating, comment }
        }
      },
      include: {
        ratings: true
      }
    });

    return NextResponse.json(scorecard);
  } catch (error: any) {
    console.error("Scorecard Create Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
