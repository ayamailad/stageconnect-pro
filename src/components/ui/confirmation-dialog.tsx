import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ConfirmationDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  isDestructive?: boolean
  isLoading?: boolean
  triggerButton?: React.ReactNode
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  isDestructive = false,
  isLoading = false,
  triggerButton
}: ConfirmationDialogProps) {
  if (triggerButton) {
    // Use trigger-based mode
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {triggerButton}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isLoading}
              className={isDestructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {isLoading ? "En cours..." : confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  // Use controlled mode
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={isDestructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {isLoading ? "En cours..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}