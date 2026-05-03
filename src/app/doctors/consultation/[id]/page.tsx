import { ConsultationForm } from "@/components/dashboard/ConsultationForm";

export default async function ConsultationPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  return (
    <div className="container mx-auto">
      <ConsultationForm patientId={id} />
    </div>
  );
}
