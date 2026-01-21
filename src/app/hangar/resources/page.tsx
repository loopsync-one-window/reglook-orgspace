"use client";

import { useState } from "react";
import { Search, Download, Filter, FileText, Image, Video, Archive, Link, Star, Eye, Calendar, User, FolderOpen, Grid, List, MoreHorizontal, Share2, Bookmark, Clock, Users, Building, Palette, GraduationCap, FileCode, Layout, Building2 } from "lucide-react";
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

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "document" | "image" | "video" | "archive" | "link" | "template";
  category: string;
  size?: string;
  uploadedBy: string;
  uploaderAvatar?: string;
  uploadedAt: string;
  views: number;
  downloads: number;
  tags: string[];
  department: string;
  isFavorite: boolean;
  thumbnail?: string;
}

// Mock resources data
const mockResources: Resource[] = [
  {
    id: "RES001",
    title: "Employee Handbook 2024",
    description: "Complete guide to company policies, procedures, and benefits for all employees.",
    type: "document",
    category: "HR Documents",
    size: "2.4 MB",
    uploadedBy: "Jenny Brahma",
    uploaderAvatar: "/avatars/jenny.jpg",
    uploadedAt: "2024-01-15",
    views: 1247,
    downloads: 234,
    tags: ["HR", "Policies", "Guidelines"],
    department: "Human Resources",
    isFavorite: true,
  },
  {
    id: "RES002",
    title: "Brand Guidelines & Assets",
    description: "Complete brand identity guidelines, logos, color palettes, and marketing materials.",
    type: "archive",
    category: "Brand Assets",
    size: "15.7 MB",
    uploadedBy: "Ananya Pandey",
    uploaderAvatar: "/avatars/ananya.jpg",
    uploadedAt: "2024-02-01",
    views: 892,
    downloads: 156,
    tags: ["Brand", "Design", "Marketing"],
    department: "Design",
    isFavorite: false,
  },
  {
    id: "RES003",
    title: "Security Training Video Series",
    description: "Comprehensive cybersecurity training videos covering best practices and threat awareness.",
    type: "video",
    category: "Training Materials",
    size: "125 MB",
    uploadedBy: "Shagun Singh",
    uploaderAvatar: "/avatars/shagun.jpg",
    uploadedAt: "2024-01-20",
    views: 567,
    downloads: 89,
    tags: ["Security", "Training", "Compliance"],
    department: "Security",
    isFavorite: true,
  },
  {
    id: "RES004",
    title: "API Documentation Portal",
    description: "Interactive documentation for all company APIs, including authentication and usage examples.",
    type: "link",
    category: "Technical Documentation",
    uploadedBy: "Veeshal D Bodosa",
    uploaderAvatar: "/avatars/veeshal.jpg",
    uploadedAt: "2024-02-10",
    views: 1345,
    downloads: 0,
    tags: ["API", "Documentation", "Development"],
    department: "Engineering",
    isFavorite: false,
  },
  {
    id: "RES005",
    title: "Project Proposal Template",
    description: "Standard template for project proposals including budget, timeline, and resource allocation.",
    type: "template",
    category: "Templates",
    size: "1.2 MB",
    uploadedBy: "Ridhima Singh",
    uploaderAvatar: "/avatars/ridhima.jpg",
    uploadedAt: "2024-01-25",
    views: 789,
    downloads: 123,
    tags: ["Template", "Project", "Proposal"],
    department: "Product",
    isFavorite: true,
  },
  {
    id: "RES006",
    title: "Office Floor Plans",
    description: "Detailed floor plans for all office locations including emergency exits and facilities.",
    type: "image",
    category: "Facilities",
    size: "5.8 MB",
    uploadedBy: "Facilities Team",
    uploadedAt: "2024-02-05",
    views: 456,
    downloads: 67,
    tags: ["Facilities", "Floor Plans", "Office"],
    department: "Facilities",
    isFavorite: false,
  },
];

// Resource categories
const categories = [
  {
    name: "HR Documents",
    count: 24,
    icon: <Users className="h-5 w-5" />,
    color: "bg-purple-500",
  },
  {
    name: "Brand Assets",
    count: 18,
    icon: <Palette className="h-5 w-5" />,
    color: "bg-pink-500",
  },
  {
    name: "Training Materials",
    count: 12,
    icon: <GraduationCap className="h-5 w-5" />,
    color: "bg-blue-500",
  },
  {
    name: "Technical Documentation",
    count: 31,
    icon: <FileCode className="h-5 w-5" />,
    color: "bg-green-500",
  },
  {
    name: "Templates",
    count: 15,
    icon: <Layout className="h-5 w-5" />,
    color: "bg-orange-500",
  },
  {
    name: "Facilities",
    count: 8,
    icon: <Building2 className="h-5 w-5" />,
    color: "bg-teal-500",
  },
];

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    const matchesType = selectedType === "All" || resource.type === selectedType;
    const matchesFavorites = !showFavoritesOnly || resource.isFavorite;
    return matchesSearch && matchesCategory && matchesType && matchesFavorites;
  });

  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "document":
        return <FileText className="h-8 w-8 text-blue-600" />;
      case "image":
        return <Image className="h-8 w-8 text-green-600" />;
      case "video":
        return <Video className="h-8 w-8 text-red-600" />;
      case "archive":
        return <Archive className="h-8 w-8 text-purple-600" />;
      case "link":
        return <Link className="h-8 w-8 text-teal-600" />;
      case "template":
        return <FolderOpen className="h-8 w-8 text-orange-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  const getTypeColor = (type: Resource["type"]) => {
    switch (type) {
      case "document":
        return "bg-blue-100 text-blue-700";
      case "image":
        return "bg-green-100 text-green-700";
      case "video":
        return "bg-red-100 text-red-700";
      case "archive":
        return "bg-purple-100 text-purple-700";
      case "link":
        return "bg-teal-100 text-teal-700";
      case "template":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-gray-900">Resource Center</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents, files, templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80 h-10 rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="gap-2"
              >
                <Star className="h-4 w-4" />
                Favorites
              </Button>
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1600px] mx-auto px-6 py-8 mt-[100px]">
        
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl border border-gray-200/60 p-4 shadow-md shadow-gray-400/20 hover:shadow-lg hover:shadow-gray-400/30 transition-all cursor-pointer"
                onClick={() => setSelectedCategory(category.name)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`h-12 w-12 rounded-lg ${category.color} flex items-center justify-center text-white shadow-lg mb-3`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">All Resources</h2>
              <Badge variant="secondary" className="rounded-full">
                {filteredResources.length} results
              </Badge>
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
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.name} onClick={() => setSelectedCategory(category.name)}>
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    File Type
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedType("All")}>All Types</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("document")}>Documents</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("image")}>Images</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("video")}>Videos</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("archive")}>Archives</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("link")}>Links</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("template")}>Templates</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Resources */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-400/20 hover:shadow-xl hover:shadow-gray-400/30 transition-all overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent pointer-events-none"></div>
                
                {/* Resource preview */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  {getTypeIcon(resource.type)}
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className={getTypeColor(resource.type)}>
                      {resource.type}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${resource.isFavorite ? "text-yellow-500" : "text-gray-400"}`}
                    >
                      <Star className={`h-4 w-4 ${resource.isFavorite ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>

                <div className="p-6 relative z-10">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={resource.uploaderAvatar} />
                      <AvatarFallback className="text-xs">
                        {resource.uploadedBy.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{resource.uploadedBy}</p>
                      <p className="text-xs text-gray-500">{formatDate(resource.uploadedAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{resource.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{resource.downloads}</span>
                      </div>
                    </div>
                    {resource.size && (
                      <span className="text-xs font-medium">{resource.size}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {resource.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Add to Favorites
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-200/60 shadow-lg shadow-gray-400/20 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {filteredResources.map((resource) => (
                <div key={resource.id} className="p-6 hover:bg-gray-50/80 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{resource.uploadedBy}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(resource.uploadedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{resource.views} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          <span>{resource.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={getTypeColor(resource.type)}>
                        {resource.type}
                      </Badge>
                      {resource.size && (
                        <span className="text-xs text-gray-500 font-medium">{resource.size}</span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${resource.isFavorite ? "text-yellow-500" : "text-gray-400"}`}
                      >
                        <Star className={`h-4 w-4 ${resource.isFavorite ? "fill-current" : ""}`} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bookmark className="h-4 w-4 mr-2" />
                            Add to Favorites
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
            <Button className="gap-2 bg-teal-600 hover:bg-teal-700 text-white">
              <Download className="h-4 w-4" />
              Upload Resource
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}