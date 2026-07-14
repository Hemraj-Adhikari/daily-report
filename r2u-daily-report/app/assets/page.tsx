import AppShell from "@/components/AppShell";
import AssetManagement from "@/components/AssetManagement";

export default function AssetsPage() {
  return (
    <AppShell
      active="assets"
      title="Asset Management"
      subtitle="Track company assets, allocation, and status"
    >
      <AssetManagement />
    </AppShell>
  );
}
