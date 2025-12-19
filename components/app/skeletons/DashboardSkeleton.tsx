import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 flex flex-col gap-10">
      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-80" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card className="p-6 border-0">
          <Skeleton className="h-6 w-full" />
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col md:flex-row bg-card shadow-sm overflow-hidden border-0">
          <div className="flex-1 p-8 flex flex-col justify-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-40 mt-2" />
            <Skeleton className="h-4 w-64 mt-4" />
          </div>
          <div className="flex-1 p-8 flex flex-col justify-center">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-48 mt-3" />
          </div>
        </Card>

        <Card className="flex flex-col justify-between p-8 bg-card shadow-sm border-0">
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-10 w-full mt-6" />
        </Card>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 border-0">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex gap-2 mt-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
