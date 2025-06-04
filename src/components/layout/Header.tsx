
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
    <header className="gradient-header border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between w-full max-w-screen-3xl">
        <Link to="/" className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-darkBlue rounded-lg flex items-center justify-center text-white font-bold text-sm">
            TP
          </div>
          <span className="text-xl font-bold text-textPrimary">Team Pulse</span>
        </Link>
        {/* Current user info */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <span className="font-semibold text-sm text-textPrimary">{currentUser.name}</span>
            <span className="text-xs text-textSecondary">{currentUser.email}</span>
          </div>
          <Avatar className="h-9 w-9 ml-2">
            {currentUser.avatarUrl ? (
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
            ) : (
              <AvatarFallback className="bg-darkBlue text-white font-medium">
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
