import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ReactNode } from "react"

export function Modal({ title, subtitle, isOpen = false, handleModal, children }: { title: string, subtitle: string, isOpen?: boolean, children: ReactNode, handleModal: () => void }) {
    return (
        <Dialog open={isOpen} onOpenChange={handleModal}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {subtitle}
                    </DialogDescription>
                </DialogHeader>
                {/* body */}
                {children}
            </DialogContent>
        </Dialog>
    )
}
