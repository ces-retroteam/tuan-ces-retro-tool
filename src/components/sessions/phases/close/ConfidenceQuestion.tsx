
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConfidenceQuestionProps {
  // Add any props needed
}

export default function ConfidenceQuestion({}: ConfidenceQuestionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How confident are you that we will deliver on time?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div className="w-full bg-blue-50 rounded-lg p-4 flex justify-between">
            <div className="flex space-x-6">
              {[1, 2, 3, 4, 5].map((score) => (
                <div key={score} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    score === 3 ? 'bg-orange-400 text-white' : 'bg-gray-100'
                  }`}>
                    {score}
                  </div>
                  <span className="text-xs mt-1">
                    {score === 1 && "VERY UNCERTAIN"}
                    {score === 2 && "UNCERTAIN"}
                    {score === 3 && "SOMEWHAT UNCERTAIN"}
                    {score === 4 && "CONFIDENT"}
                    {score === 5 && "VERY CONFIDENT"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">No participants responded</p>
        </div>
      </CardContent>
    </Card>
  );
}
