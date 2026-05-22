
import LecturePlayerClient from "./client-page";

export function generateStaticParams() {
  return [
    { id: 'example' }
  ];
}

export default function Page() {
  return <LecturePlayerClient />;
}
