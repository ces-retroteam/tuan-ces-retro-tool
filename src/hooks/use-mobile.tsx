
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Initial check based on window width
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial value
    checkIsMobile()
    
    // Set up event listener for window resize
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Modern approach using addEventListener
    const handleChange = () => checkIsMobile()
    mql.addEventListener("change", handleChange)
    
    // Clean up
    return () => mql.removeEventListener("change", handleChange)
  }, [])

  // Default to non-mobile if state is undefined
  return isMobile === undefined ? false : isMobile
}
