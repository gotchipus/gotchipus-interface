interface Win98WarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  children: React.ReactNode;
  buttonText?: string;
}

const Win98WarningDialog = ({
  isOpen,
  onClose,
  title,
  icon,
  iconBgColor = "#ffff80",
  children,
  buttonText = "OK"
}: Win98WarningDialogProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="win98-window w-80">
        <div className="win98-title-bar flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-white text-xs font-bold">{title}</span>
          </div>
          <div className="win98-controls">
            <button 
              className="win98-control-button"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>
        <div className="win98-content p-4">
          <div className="flex items-start mb-4">
            {icon && (
              <div className={`w-10 h-10 ${iconBgColor} flex items-center justify-center mr-3`}>
                {icon}
              </div>
            )}
            <div>
              {children}
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              className="win98-button"
              onClick={onClose}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Win98WarningDialog;