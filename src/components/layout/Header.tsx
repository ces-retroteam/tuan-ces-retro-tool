
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dummy current user data (replace with actual user info in a real app)
const currentUser = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  avatarUrl: "", // leave blank to use initials fallback
};

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            TP
          </div>
          <span className="text-xl font-bold">Team Pulse</span>
        </Link>
        {/* Current user info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{currentUser.name}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</span>
          </div>
          <Avatar className="h-9 w-9 ml-2">
            {currentUser.avatarUrl ? (
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
            ) : (
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
    </header>
  );
}
