
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Team Pulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
