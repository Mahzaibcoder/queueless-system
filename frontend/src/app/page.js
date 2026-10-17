import Link from "next/link";

const features = [
  {
    title: "Skip the Queue",
    description:
      "Book appointments instantly and avoid long waiting lines at your favorite businesses.",
    icon: "⚡",
  },
  {
    title: "Real-Time Availability",
    description:
      "See open time slots updated in real time so you never miss a slot.",
    icon: "📅",
  },
  {
    title: "Smart Reminders",
    description:
      "Get timely reminders and updates so you are always on time for appointments.",
    icon: "🔔",
  },
  {
    title: "Business Dashboard",
    description:
      "Manage bookings, staff, and services from a single, easy-to-use dashboard.",
    icon: "📊",
  },
];

export default function Home() {
  return (
    <section className="space-y-20">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 px-6 py-16 text-center sm:px-12 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            Appointment Booking System
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Skip the line. <span className="text-primary">Book in seconds.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            QueueLess helps customers find businesses, check real-time availability,
            and book appointments without the wait.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Get Started
            </Link>
            <Link
              href="/businesses"
              className="inline-flex w-full items-center justify-center rounded-md border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted sm:w-auto"
            >
              Browse Businesses
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Why QueueLess?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to manage and book appointments effortlessly.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
            >
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
        <h2 className="text-2xl font-bold sm:text-3xl">
          Ready to skip the line?
        </h2>
        <p className="mt-3 text-primary-foreground/80">
          Create your account and start booking appointments today.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex w-full items-center justify-center rounded-md bg-background px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-background/90 sm:w-auto"
          >
            Get Started
          </Link>
          <Link
            href="/businesses"
            className="inline-flex w-full items-center justify-center rounded-md border border-primary-foreground/40 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 sm:w-auto"
          >
            Browse Businesses
          </Link>
        </div>
      </div>
    </section>
  );
}
