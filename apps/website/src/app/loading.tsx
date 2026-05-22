import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Skeleton */}
      <div className="h-24 w-full border-b border-gray-100 flex items-center px-4 sm:px-8">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <div className="hidden md:flex gap-8">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>

      {/* Hero Skeleton */}
      <section className="h-[70vh] w-full flex items-center justify-center px-4 sm:px-8">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-14 w-44 rounded-full" />
              <Skeleton className="h-14 w-44 rounded-full" />
            </div>
          </div>
          <div className="hidden lg:block h-[400px]">
            <Skeleton className="h-full w-full rounded-[48px]" />
          </div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="py-24 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <Skeleton className="h-4 w-32 rounded-full mx-auto" />
            <Skeleton className="h-10 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-3xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-3xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-3xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
