import ActivityItem from './ActivityItem'

interface ActivityFeedProps {
  items: {
    id: string
    text: string
    timestamp: string
    type: 'ai' | 'manual'
  }[]
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-[20px] flex flex-col h-full">
      <h4 className="font-body text-[15px] font-semibold text-neutral-900 mb-[16px]">
        Recent Activity
      </h4>
      
      <div className="flex flex-col flex-grow">
        {items.map((item, index) => (
          <ActivityItem 
            key={item.id}
            text={item.text}
            timestamp={item.timestamp}
            type={item.type}
            isLast={index === items.length - 1}
          />
        ))}
      </div>
      
      <button className="font-body text-[13px] text-primary-500 font-medium hover:text-primary-600 transition-colors mt-[16px] text-left w-fit">
        View all activity
      </button>
    </div>
  )
}
