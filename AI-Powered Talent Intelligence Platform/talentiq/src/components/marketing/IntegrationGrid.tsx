import AnimatedGrid from './AnimatedGrid'

export default function IntegrationGrid() {
  const integrations = [
    { name: 'Slack', color: '#4A154B', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/slack.svg' },
    { name: 'Google Workspace', color: '#4285F4', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/google.svg' },
    { name: 'Microsoft Teams', color: '#6264A7', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/microsoftteams.svg' },
    { name: 'Greenhouse', color: '#00B289', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/greenhouse.svg' },
    { name: 'LinkedIn', color: '#0A66C2', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/linkedin.svg' },
    { name: 'Indeed', color: '#003A9B', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/indeed.svg' },
    { name: 'Calendly', color: '#006BFF', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/calendly.svg' },
    { name: 'Zoom', color: '#2D8CFF', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/zoom.svg' },
    { name: 'DocuSign', color: '#172774', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/docusign.svg' },
    { name: 'Workday', color: '#0071CE', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/workday.svg' },
    { name: 'Zapier', color: '#FF4A00', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/zapier.svg' },
    { name: 'BambooHR', color: '#7EBC42', icon: 'https://cdn.jsdelivr.net/npm/simple-icons@v12/icons/bamboohr.svg' },
  ]

  return (
    <AnimatedGrid animation="flip" columns={6} gap={16} className="max-w-[1000px] mx-auto">
      {integrations.map((int, i) => (
        <div 
          key={i}
          className="bg-white border border-neutral-200 rounded-lg shadow-xs h-20 flex flex-col items-center justify-center gap-2 hover:shadow-md hover:border-neutral-300 transition-all duration-150 cursor-pointer"
        >
          <div 
            className="w-10 h-10 rounded-md flex items-center justify-center p-2 opacity-90 transition-opacity group-hover:opacity-100"
          >
            <img src={int.icon} alt={int.name} className="w-full h-full object-contain" />
          </div>
          <span className="font-body text-[11px] text-neutral-500 font-medium">
            {int.name}
          </span>
        </div>
      ))}
    </AnimatedGrid>
  )
}
