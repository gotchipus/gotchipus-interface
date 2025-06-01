import Image from "next/image"

interface EquipTabProps {
  selectedEquipSlot: number | null
  handleEquipSlotClick: (index: number) => void
}

const EquipTab = ({
  selectedEquipSlot,
  handleEquipSlotClick
}: EquipTabProps) => {

  const equipSlots = [
    { name: "Background", icon: "/gotchi/e4.png", color: "bg-[#d4d0c8]" },
    { name: "Eye", icon: "/gotchi/e2.png", color: "bg-[#d4d0c8]" },
    { name: "Head", icon: "/gotchi/e3.png", color: "bg-[#d4d0c8]" },
    { name: "Left Hand", icon: "/gotchi/e1.png", color: "bg-[#d4d0c8]" },
    { name: "Right Hand", icon: "/gotchi/e1.png", color: "bg-[#d4d0c8]" },
    { name: "Body", icon: "/gotchi/e5.png", color: "bg-[#d4d0c8]" },
  ];

  return (
    <div className="border-2 border-[#808080] shadow-win98-outer bg-[#d4d0c8] rounded-sm p-6">
      <div className="text-lg font-bold mb-4 flex items-center border-b border-[#808080] pb-2">
        <Image src="/icons/equip.png" alt="Equip" width={18} height={18} className="mr-2" />
        Equip Your Gotchipus
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {equipSlots.map((slot, index) => (
          <div
            key={index}
            className={`flex flex-col cursor-pointer ${selectedEquipSlot === index ? "scale-105" : ""}`}
            onClick={() => handleEquipSlotClick(index)}
          >
            <div
              className={`aspect-square border-2 ${selectedEquipSlot === index ? "border-[#000080]" : "border-[#808080]"} shadow-win98-inner bg-[#c0c0c0] rounded-t-sm flex items-center justify-center p-4`}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image 
                  src={slot.icon} 
                  alt={slot.name} 
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            <div
              className={`border-2 border-t-0 ${selectedEquipSlot === index ? "border-[#000080] bg-[#c0c0c0]" : "border-[#808080] bg-[#d4d0c8]"} shadow-win98-outer rounded-b-sm p-3 text-center font-medium text-base`}
            >
              {slot.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EquipTab 