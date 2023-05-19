import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
import CreateMarketForm from "./CreateMarketForm";

export function CreateMarketDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create Market</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Market</DialogTitle>
                </DialogHeader>
                <CreateMarketForm />
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
