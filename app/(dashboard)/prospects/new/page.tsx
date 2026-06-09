import { Header } from "@/components/layout/header";
import { ProspectForm } from "@/components/prospects/prospect-form";

export default function NewProspectPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Add New Prospect" subtitle="Add a restaurant to your pipeline" />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <ProspectForm />
        </div>
      </div>
    </div>
  );
}
