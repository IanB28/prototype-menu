import { PublicMenu } from "@/components/public-menu";

export default function MenuPage({ params }: { params: { slug: string } }) {
  return <PublicMenu slug={params.slug} />;
}
