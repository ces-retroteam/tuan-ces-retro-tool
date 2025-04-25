import { useSession } from "@/context/SessionContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar, Menu, User } from "lucide-react";

export function ActionsList() {
  const { actions } = useSession();

  return (
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl flex items-center gap-3">
          Team actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Actions from health check section */}
        <div className="space-y-4">
          <h3 className="text-gray-600">Actions from this health check</h3>
          
          {/* Add action input area with yellow bg */}
          <div className="bg-yellow-50/50 p-4 rounded-lg border border-yellow-100">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                +
              </span>
              Add action...
            </div>
          </div>

          <div className="text-gray-500 text-sm py-4 text-center">
            No actions yet
          </div>
        </div>

        {/* Other open actions section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-600">Other open actions</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">SHOW PUBLISHED</span>
              <Switch />
            </div>
          </div>

          {/* Action items */}
          <div className="space-y-2">
            {actions.map((action) => (
              <div 
                key={action.id} 
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center" />
                  <span className="text-gray-700">{action.text}</span>
                  <span className="text-gray-400 text-sm">
                    {new Date(action.createdAt).toLocaleDateString('en-US', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short'
                    }).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Menu className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Calendar className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <User className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
