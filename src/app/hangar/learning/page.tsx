"use client";

import { useState } from "react";
import { Search, Play, Book, Award, Clock, Star, ChevronRight, Filter, Users, BarChart3, Download, BookOpen, Video, FileText, Headphones, Target, Trophy, TrendingUp, Code, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar?: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  rating: number;
  enrollments: number;
  progress?: number;
  type: "video" | "document" | "interactive" | "audio";
  tags: string[];
  thumbnail: string;
  status: "enrolled" | "completed" | "available" | "locked";
}

// Mock courses data
const mockCourses: Course[] = [
  {
    id: "C001",
    title: "Modern React Development Fundamentals",
    description: "Master the latest React patterns, hooks, and best practices for building scalable applications.",
    instructor: "Ripun Basumatary",
    instructorAvatar: "/avatars/ripun.jpg",
    duration: "4.5 hours",
    difficulty: "Intermediate",
    category: "Development",
    rating: 4.8,
    enrollments: 234,
    progress: 65,
    type: "video",
    tags: ["React", "JavaScript", "Frontend"],
    thumbnail: "/thumbnails/react.jpg",
    status: "enrolled",
  },
  {
    id: "C002",
    title: "Leadership Excellence Program",
    description: "Develop essential leadership skills for managing teams and driving organizational success.",
    instructor: "Jenny Brahma",
    instructorAvatar: "/avatars/jenny.jpg",
    duration: "6 hours",
    difficulty: "Advanced",
    category: "Leadership",
    rating: 4.9,
    enrollments: 156,
    progress: 30,
    type: "interactive",
    tags: ["Leadership", "Management", "Soft Skills"],
    thumbnail: "/thumbnails/leadership.jpg",
    status: "enrolled",
  },
  {
    id: "C003",
    title: "Data Analytics with Python",
    description: "Learn data analysis, visualization, and machine learning basics using Python and popular libraries.",
    instructor: "Veeshal D Bodosa",
    instructorAvatar: "/avatars/veeshal.jpg",
    duration: "8 hours",
    difficulty: "Intermediate",
    category: "Data Science",
    rating: 4.7,
    enrollments: 189,
    type: "video",
    tags: ["Python", "Data Science", "Analytics"],
    thumbnail: "/thumbnails/python.jpg",
    status: "available",
  },
  {
    id: "C004",
    title: "UX Design Principles",
    description: "Master user experience design principles, research methods, and prototyping techniques.",
    instructor: "Ananya Pandey",
    instructorAvatar: "/avatars/ananya.jpg",
    duration: "5.5 hours",
    difficulty: "Beginner",
    category: "Design",
    rating: 4.6,
    enrollments: 298,
    progress: 100,
    type: "interactive",
    tags: ["UX", "Design", "Prototyping"],
    thumbnail: "/thumbnails/ux.jpg",
    status: "completed",
  },
  {
    id: "C005",
    title: "Cybersecurity Fundamentals",
    description: "Essential cybersecurity concepts, threat detection, and protection strategies for modern organizations.",
    instructor: "Shagun Singh",
    instructorAvatar: "/avatars/shagun.jpg",
    duration: "3 hours",
    difficulty: "Beginner",
    category: "Security",
    rating: 4.5,
    enrollments: 145,
    type: "document",
    tags: ["Security", "Cybersecurity", "Compliance"],
    thumbnail: "/thumbnails/security.jpg",
    status: "available",
  },
];

// Learning paths
const learningPaths = [
  {
    id: "LP001",
    title: "Full Stack Developer",
    description: "Complete journey from frontend to backend development",
    courses: 8,
    duration: "32 hours",
    level: "Intermediate",
    icon: <Code className="h-6 w-6" />,
    color: "bg-blue-500",
  },
  {
    id: "LP002",
    title: "Leadership Track",
    description: "Develop management and leadership capabilities",
    courses: 5,
    duration: "20 hours",
    level: "Advanced",
    icon: <Crown className="h-6 w-6" />,
    color: "bg-purple-500",
  },
  {
    id: "LP003",
    title: "Data Professional",
    description: "Analytics, visualization, and data science fundamentals",
    courses: 6,
    duration: "28 hours",
    level: "Intermediate",
    icon: <BarChart3 className="h-6 w-6" />,
    color: "bg-green-500",
  },
];

export default function LearningPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"courses" | "paths" | "progress">("courses");

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || course.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getStatusColor = (status: Course["status"]) => {
    switch (status) {
      case "enrolled":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "available":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "locked":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getDifficultyColor = (difficulty: Course["difficulty"]) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "Advanced":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type: Course["type"]) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "interactive":
        return <Target className="h-4 w-4" />;
      case "audio":
        return <Headphones className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-900">Learning Center</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courses, skills, topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 h-10 rounded-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Trophy className="h-4 w-4 mr-1" />
                1,250 XP
              </Badge>
              <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                <BookOpen className="h-4 w-4" />
                My Learning
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8 mt-[100px]">
        
        {/* Learning Stats */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-6 shadow-lg shadow-purple-500/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Courses Enrolled</h3>
                  <div className="text-2xl font-bold text-gray-900">12</div>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-6 shadow-lg shadow-green-500/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Completed</h3>
                  <div className="text-2xl font-bold text-gray-900">8</div>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-6 shadow-lg shadow-blue-500/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Hours Learned</h3>
                  <div className="text-2xl font-bold text-gray-900">47.5</div>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-6 shadow-lg shadow-orange-500/20 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">Skill Level</h3>
                  <div className="text-2xl font-bold text-gray-900">Advanced</div>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <Button
                variant={activeTab === "courses" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("courses")}
                className="h-8 px-4"
              >
                Courses
              </Button>
              <Button
                variant={activeTab === "paths" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("paths")}
                className="h-8 px-4"
              >
                Learning Paths
              </Button>
              <Button
                variant={activeTab === "progress" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("progress")}
                className="h-8 px-4"
              >
                My Progress
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Category
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedCategory("All")}>All Categories</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("Development")}>Development</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("Leadership")}>Leadership</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("Design")}>Design</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedCategory("Data Science")}>Data Science</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    Level
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedDifficulty("All")}>All Levels</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedDifficulty("Beginner")}>Beginner</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedDifficulty("Intermediate")}>Intermediate</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedDifficulty("Advanced")}>Advanced</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "courses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-400/20 hover:shadow-xl hover:shadow-gray-400/30 transition-all overflow-hidden relative group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none"></div>
                
                {/* Course thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      {getTypeIcon(course.type)}
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
                      {course.difficulty}
                    </Badge>
                  </div>
                  {course.progress && (
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-white/20">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="p-6 relative z-10">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={course.instructorAvatar} />
                      <AvatarFallback className="text-xs">
                        {course.instructor.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{course.instructor}</p>
                      <p className="text-xs text-gray-500">{course.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{course.enrollments}</span>
                      </div>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      {course.status === "enrolled" ? "Continue" : course.status === "completed" ? "Review" : "Enroll"}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "paths" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learningPaths.map((path) => (
              <div
                key={path.id}
                className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-6 shadow-lg shadow-gray-400/20 hover:shadow-xl hover:shadow-gray-400/30 transition-all relative overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`h-12 w-12 rounded-xl ${path.color} flex items-center justify-center text-white shadow-lg`}>
                      {path.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{path.title}</h3>
                      <p className="text-sm text-gray-600">{path.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Courses</p>
                      <p className="font-semibold">{path.courses}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="font-semibold">{path.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {path.level}
                    </Badge>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      Start Path
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "progress" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 p-6 shadow-lg shadow-gray-400/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Enrollments</h3>
              <div className="space-y-4">
                {mockCourses.filter(course => course.status === "enrolled").map((course) => (
                  <div key={course.id} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <p className="text-sm text-gray-500">{course.instructor} • {course.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{course.progress}% Complete</p>
                      <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}