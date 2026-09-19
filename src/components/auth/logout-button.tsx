import { LogOut } from "lucide-react";

import { logout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button size="sm" type="submit" variant="outline">
        <LogOut aria-hidden="true" className="size-4" />
        Keluar
      </Button>
    </form>
  );
}
