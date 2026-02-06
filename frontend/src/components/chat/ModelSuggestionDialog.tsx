import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ModelAlternative {
  id: string;
  name: string;
  recommended_for: string;
}

interface ModelSuggestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (modelId: string) => void;
  onCancel: () => void;
  suggestedModel: string;
  reason: string;
  alternatives?: ModelAlternative[];
}

export function ModelSuggestionDialog({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  suggestedModel,
  reason,
  alternatives = [],
}: ModelSuggestionDialogProps) {
  // Use alternatives if available, otherwise fallback to single suggested model
  const modelsToShow = alternatives.length > 0
    ? alternatives
    : [{ id: suggestedModel, name: suggestedModel, recommended_for: '' }];

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-[#1a1a1a] border-gray-700 max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white text-xl font-semibold">
            Switch Model?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300 pt-3 text-base leading-relaxed">
            {reason}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 mt-4">
          <p className="text-sm text-gray-400 font-medium">Recommended Models:</p>
          {modelsToShow.map((model) => (
            <button
              key={model.id}
              onClick={() => onConfirm(model.id)}
              className="w-full bg-white/5 hover:bg-white/10 text-white border border-gray-600 hover:border-gray-500 py-3 px-4 rounded-lg text-left transition-colors"
            >
              <div className="font-semibold">{model.name}</div>
              {model.recommended_for && (
                <div className="text-xs text-gray-400 mt-1">
                  Best for: {model.recommended_for}
                </div>
              )}
            </button>
          ))}
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel
            onClick={onCancel}
            className="w-full bg-transparent text-gray-300 hover:bg-white/10 hover:text-white border border-gray-600 mt-0 py-3 text-base rounded-lg"
          >
            Continue with current model
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
