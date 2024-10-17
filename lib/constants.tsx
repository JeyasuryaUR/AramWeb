import { FaHeartbeat, FaPaw, FaUtensils, FaHandsHelping, FaMedkit } from "react-icons/fa";

export const postCategories = [
  { id: "GH", name: "General Help", link: "/category/general-help", icon: <FaHandsHelping /> },
  { id: "MA", name: "Medical Aid", link: "/category/medical-aid", icon: <FaMedkit /> },
  { id: "BD", name: "Blood Donation", link: "/category/blood-donation", icon: <FaHeartbeat /> },
  { id: "AA", name: "Animal Aid", link: "/category/animal-aid", icon: <FaPaw /> },
  { id: "FA", name: "Food Assistance", link: "/category/food-assistance", icon: <FaUtensils /> },
  { id: "SW", name: "Student Welfare", link: "/category/student-welfare", icon: <FaMedkit /> },
];

export const urgencyLevels = ["Low", "Medium", "High"];