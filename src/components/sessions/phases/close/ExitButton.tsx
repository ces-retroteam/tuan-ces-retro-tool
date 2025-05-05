
import { Button } from '@/components/ui/button';
import { Card, CardFooter } from '@/components/ui/card';

interface ExitButtonProps {
  onExit: () => void;
}

export default function ExitButton({ onExit }: ExitButtonProps) {
  return (
    <Card>
      <CardFooter className="flex justify-center pt-6">
        <Button 
          onClick={onExit}
          className="bg-blue-400 hover:bg-blue-500 text-white px-10"
        >
          EXIT
        </Button>
      </CardFooter>
    </Card>
  );
}
