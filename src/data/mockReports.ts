
import { Report } from "@/components/ReportCard";

export const mockReports: Report[] = [
  {
    id: "1",
    title: "Large pothole on Main Street",
    description: "Deep pothole approximately 2 feet wide near the intersection with Oak Avenue",
    location: "123 Main St, Anytown",
    status: "active",
    category: "pothole",
    date: "2023-06-15",
    upvotes: 12
  },
  {
    id: "2",
    title: "Water logging after rainfall",
    description: "Persistent water accumulation blocking pedestrian access during rainy days",
    location: "45 Park Lane, Anytown",
    status: "investigating",
    category: "waterlogging",
    date: "2023-07-02",
    upvotes: 8
  },
  {
    id: "3",
    title: "Broken street light",
    description: "Street light not functioning for over a week creating darkness in the area",
    location: "78 Pine Road, Anytown",
    status: "resolved",
    category: "other",
    date: "2023-05-20",
    upvotes: 5
  }
];
