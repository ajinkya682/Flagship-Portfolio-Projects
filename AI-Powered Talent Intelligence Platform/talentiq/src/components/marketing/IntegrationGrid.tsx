export default function IntegrationGrid() {
  const integrations = [
    { name: 'Slack', color: '#4A154B', short: 'Sl' },
    { name: 'Google Workspace', color: '#4285F4', short: 'Go' },
    { name: 'Microsoft Teams', color: '#6264A7', short: 'Te' },
    { name: 'Greenhouse', color: '#00B289', short: 'Gr' },
    { name: 'LinkedIn', color: '#0A66C2', short: 'In' },
    { name: 'Indeed', color: '#003A9B', short: 'Id' },
    { name: 'Calendly', color: '#006BFF', short: 'Ca' },
    { name: 'Zoom', color: '#2D8CFF', short: 'Zo' },
    { name: 'DocuSign', color: '#172774', short: 'Ds' },
    { name: 'Workday', color: '#0071CE', short: 'Wd' },
    { name: 'Zapier', color: '#FF4A00', short: 'Za' },
    { name: 'BambooHR', color: '#7EBC42', short: 'Bh' },
  ]

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-[1000px] mx-auto">
      {integrations.map((int, i) => (
        <div 
          key={i}
          className="bg-white border border-neutral-200 rounded-lg shadow-xs h-20 flex flex-col items-center justify-center gap-2 hover:shadow-md hover:border-neutral-300 transition-all duration-150 cursor-pointer"
        >
          <div 
            className="w-8 h-8 rounded-md flex items-center justify-center text-white font-display text-[14px] font-bold shadow-sm"
            style={{ backgroundColor: int.color }}
          >
            {int.short}
          </div>
          <span className="font-body text-[11px] text-neutral-500 font-medium">
            {int.name}
          </span>
        </div>
      ))}
    </div>
  )
}
