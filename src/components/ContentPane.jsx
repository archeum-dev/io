import { useEffect, useRef, useState } from 'react'

// Helper function to darken a hex color
const darkenColor = (hex, percent = 40) => {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.max(0, Math.floor((num >> 16) * (1 - percent / 100)))
    const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - percent / 100)))
    const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - percent / 100)))
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export default function ContentPane({ animationPhase, isMobile, onScrollProgress, onDragProgress, scrollRef, isDragging, setIsDragging, isOnFinalPage, setIsOnFinalPage, scrollProgress }) {
    const containerRef = useRef(null)
    const sectionRefs = useRef({})
    const [activeCardIndex, setActiveCardIndex] = useState(0)
    const [touchStart, setTouchStart] = useState(null)
    const [touchCurrent, setTouchCurrent] = useState(null)

    // Combine internal ref with external ref
    const setRefs = (el) => {
        containerRef.current = el
        if (scrollRef) {
            scrollRef.current = el
        }
    }

    // Sync activeCardIndex with animationPhase changes (for titlebar reset on mobile)
    useEffect(() => {
        if (!isMobile || isDragging) return // Don't sync during drag to avoid conflicts

        const phaseToIndex = {
            'intro': 0,
            'foundation': 1,
            'network': 2,
            'ecosystem': 3
            // Note: final page keeps phase as 'ecosystem'
        }

        const index = phaseToIndex[animationPhase]
        if (index !== undefined && index !== activeCardIndex) {
            setActiveCardIndex(index)
        }
    }, [animationPhase, isMobile, activeCardIndex, isDragging])

    // Mobile touch handling for continuous vertical scroll navigation
    useEffect(() => {
        if (!isMobile) return

        const handleTouchStart = (e) => {
            setIsDragging(true)
            setTouchStart(e.targetTouches[0].clientY)
            setTouchCurrent(e.targetTouches[0].clientY)
        }

        const handleTouchMove = (e) => {
            if (!isDragging || !touchStart) return

            const currentY = e.targetTouches[0].clientY
            setTouchCurrent(currentY)

            // Calculate drag distance (positive = scrolling up/forward, negative = scrolling down/backward)
            const dragDistance = touchStart - currentY
            const screenHeight = window.innerHeight
            const dragProgress = dragDistance / screenHeight

            // Apply dampening factor (0.4) for scene partial animation
            const dampenedProgress = dragProgress * 0.4

            // Map activeCardIndex to actual discrete snap points
            // Note: final page is at 1.0 (0.82 blackout)
            const snapPoints = [0, 0.18, 0.38, 0.61, 0.82]
            let baseProgress = snapPoints[activeCardIndex] || 0

            // If on final page, start from blackout state
            if (isOnFinalPage) {
                baseProgress = 0.82
            }

            // Calculate range for partial animation
            let nextSnap, prevSnap
            if (isOnFinalPage) {
                // On final page, can only go back to ecosystem
                nextSnap = 0.82
                prevSnap = 0.61
            } else if (activeCardIndex === 3) {
                // On ecosystem, can go to final page
                nextSnap = 0.82
                prevSnap = snapPoints[activeCardIndex - 1] || baseProgress
            } else {
                nextSnap = snapPoints[activeCardIndex + 1] ?? baseProgress
                prevSnap = snapPoints[activeCardIndex - 1] ?? baseProgress
            }

            // Clamp to stay within prev/next snap boundaries
            const minProgress = prevSnap
            const maxProgress = nextSnap
            const newProgress = Math.max(minProgress, Math.min(maxProgress, baseProgress + dampenedProgress))

            // Use drag handler for continuous updates (bypasses quantization)
            onDragProgress(newProgress)
        }

        const handleTouchEnd = () => {
            if (!isDragging || !touchStart || !touchCurrent) {
                setIsDragging(false)
                return
            }

            const distance = touchStart - touchCurrent
            const swipeThreshold = 50
            const isSwipeUp = distance > swipeThreshold    // Swipe up = go to next section
            const isSwipeDown = distance < -swipeThreshold // Swipe down = go to previous section

            if (isSwipeUp && activeCardIndex < 3) {
                // Swipe up - go to next section
                const newIndex = activeCardIndex + 1
                setActiveCardIndex(newIndex)
                setIsOnFinalPage(false)
                onScrollProgress(newIndex / 4)
            } else if (isSwipeUp && activeCardIndex === 3 && !isOnFinalPage) {
                // Swipe up from ecosystem - trigger final screen
                setIsOnFinalPage(true)
                onScrollProgress(1.0) // Trigger final overlay
            } else if (isSwipeDown && isOnFinalPage) {
                // Swipe down from final page - go back to ecosystem
                setIsOnFinalPage(false)
                onScrollProgress(0.75) // Back to ecosystem
            } else if (isSwipeDown && activeCardIndex > 0) {
                // Swipe down - go to previous section
                const newIndex = activeCardIndex - 1
                setActiveCardIndex(newIndex)
                setIsOnFinalPage(false)
                onScrollProgress(newIndex / 4)
            } else {
                // Snap back to current section
                if (isOnFinalPage) {
                    onScrollProgress(1.0)
                } else {
                    onScrollProgress(activeCardIndex / 4)
                }
            }

            setIsDragging(false)
            setTouchStart(null)
            setTouchCurrent(null)
        }

        const container = containerRef.current
        if (!container) return

        container.addEventListener('touchstart', handleTouchStart, { passive: true })
        container.addEventListener('touchmove', handleTouchMove, { passive: true })
        container.addEventListener('touchend', handleTouchEnd, { passive: true })

        return () => {
            container.removeEventListener('touchstart', handleTouchStart)
            container.removeEventListener('touchmove', handleTouchMove)
            container.removeEventListener('touchend', handleTouchEnd)
        }
    }, [isMobile, touchStart, touchCurrent, isDragging, setIsDragging, activeCardIndex, isOnFinalPage, onScrollProgress, onDragProgress])


    const sections = [
        {
            id: 'intro',
            title: 'ARCHEUM',
            useBanner: true,
            description: 'The decentralized cloud for next-generation applications.',
            subtitle: 'Scroll to explore ↓',
            titleColor: '#ffffff',
            subtitleColor: '#00f0ff'
        },
        {
            id: 'foundation',
            title: 'The Foundation',
            description: 'Anchored on Ethereum. Secure, immutable, and decentralized trust at Archeum\'s core.',
            subtitle: '',
            titleColor: '#ffffff',
            subtitleColor: '#ffffff',
            details: [
                'Leverages Ethereum\'s proven technology',
                'Immutable smart contract as central registry',
                'Used as the sole source of identity',
                'No single point of failure'
            ]
        },
        {
            id: 'network',
            title: 'Real-Time Storage',
            description: 'Run your own Archeum Node - personal cloud storage tied to your identity. People can read and interact with your content in real-time.',
            subtitle: '',
            titleColor: '#00f0ff',
            subtitleColor: '#00f0ff',
            details: [
                'Fast, efficient nodes written in Rust',
                'Fast, secure connections over QUIC',
                'Human-readable handles (@alice)',
                'End-to-end encryption for all data by default',
            ]
        },
        {
            id: 'ecosystem',
            title: 'The Ecosystem',
            description: 'Applications run on the edge with data from nodes. No barrier to entry for developers, driving innovation, collaboration, and competition.',
            subtitle: '',
            titleColor: '#ff8800',
            subtitleColor: '#ff8800',
            details: [
                'Free for developers, small one-time cost for users',
                'Apps orchestrate data flows and interactions',
                'No single point of failure, or shutdowns, for any app',
            ]
        }
    ]

    const backgroundColor = `linear-gradient(135deg, rgba(32, 32, 36, 0.8) 0%, rgba(24, 24, 27, 0.9) 100%),
           repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px),
           repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px),
           #1f1f23`

    const textColor = 'white'

    // Calculate drag offset for sliding animations (mobile only)
    // Sections slide 1:1 with finger (no dampening) - now vertical
    const dragOffset = isMobile && isDragging && touchStart && touchCurrent
        ? ((touchStart - touchCurrent) / window.innerHeight) * 100
        : 0

    return (
        <div
            ref={setRefs}
            style={{
                position: 'fixed',
                top: isMobile ? 0 : 'auto',
                bottom: 0,
                left: 0,
                right: isMobile ? 0 : 'auto',
                width: isMobile ? '100vw' : '35%',
                height: isMobile ? '100vh' : 'auto',
                maxHeight: isMobile ? '100vh' : '60vh',
                overflow: isMobile ? 'hidden' : 'visible',
                background: 'transparent',
                color: textColor,
                scrollBehavior: isMobile ? 'auto' : 'smooth',
                pointerEvents: 'auto',
                paddingTop: isMobile ? '0' : '0',
                paddingBottom: isMobile ? '0' : '3rem',
                paddingLeft: isMobile ? '0' : '3rem',
                paddingRight: isMobile ? '0' : '3rem',
                transition: 'background 0.3s ease, color 0.3s ease',
                scrollSnapType: 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                zIndex: 10,
                boxSizing: 'border-box'
            }}
        >
            {/* Mobile gradient overlay behind text - full screen but non-interactive */}
            {isMobile && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 30%, transparent 50%)',
                    pointerEvents: 'none',
                    zIndex: -1
                }} />
            )}

            <div style={{
                position: 'relative',
                width: '100%',
                height: isMobile ? '100vh' : 'auto',
                overflow: 'visible',
                paddingTop: isMobile ? '1.5rem' : '0',
                paddingBottom: isMobile ? 'calc(2.5rem + env(safe-area-inset-bottom, 0px))' : '0',
                boxSizing: 'border-box'
            }}
            >
                {/* Content sections */}
                {sections.map((section, index) => {
                    // Calculate transform for sliding animation (mobile only)
                    let transform = 'translateY(0)'
                    let opacity = 1
                    let pointerEvents = 'auto'

                    if (isMobile) {
                        if (isOnFinalPage) {
                            // On final page - all sections are off-screen upward (scrolled out)
                            transform = 'translateY(-100%)'
                            opacity = 0
                            pointerEvents = 'none'
                        } else if (isDragging) {
                            // During drag, show current, next, and previous sections
                            if (index === activeCardIndex) {
                                // Current section slides with drag - fade out as it scrolls up
                                transform = `translateY(${-dragOffset}%)`
                                // Quick fade as content approaches top
                                opacity = Math.max(0, 1 - (dragOffset / 30))
                            } else if (index === activeCardIndex + 1) {
                                // Next section slides in from bottom
                                transform = `translateY(${100 - dragOffset}%)`
                                // Fade in as it approaches - start fading in when 70% off-screen
                                const fadeInProgress = dragOffset / 30
                                opacity = Math.max(0, Math.min(1, fadeInProgress))
                            } else if (index === activeCardIndex - 1) {
                                // Previous section slides in from top
                                // Position: starts at -100%, ends at 0% when dragOffset reaches -100
                                const position = -100 - dragOffset  // e.g., dragOffset=-50 -> position=-50%
                                transform = `translateY(${position}%)`
                                // Fade in over the last 30% of travel (when position goes from -30% to 0%)
                                // At position -30%, opacity = 0. At position 0%, opacity = 1.
                                const fadeInProgress = (30 + position) / 30  // position is negative
                                opacity = Math.max(0, Math.min(1, fadeInProgress))
                            } else {
                                // Hide other sections
                                opacity = 0
                                pointerEvents = 'none'
                            }
                        } else {
                            // Not dragging - only show active section
                            if (index === activeCardIndex) {
                                transform = 'translateY(0)'
                                opacity = 1
                            } else if (index < activeCardIndex) {
                                // Sections before active are off-screen upward (scrolled out)
                                transform = 'translateY(-100%)'
                                opacity = 0
                                pointerEvents = 'none'
                            } else {
                                // Sections after active are below (waiting)
                                transform = 'translateY(100%)'
                                opacity = 0
                                pointerEvents = 'none'
                            }
                        }
                    } else {
                        // Desktop: snap between sections with scroll-up animation
                        // Only one section visible at a time
                        const phaseOrder = ['intro', 'foundation', 'network', 'ecosystem']
                        const currentPhaseIndex = phaseOrder.indexOf(animationPhase)
                        const sectionIndex = phaseOrder.indexOf(section.id)

                        if (sectionIndex < currentPhaseIndex) {
                            // Past sections - scrolled up and out
                            transform = 'translateY(-100%)'
                            opacity = 0
                            pointerEvents = 'none'
                        } else if (sectionIndex === currentPhaseIndex) {
                            // Current active section
                            transform = 'translateY(0%)'
                            opacity = 1
                            pointerEvents = 'auto'
                        } else {
                            // Future sections - waiting below
                            transform = 'translateY(100%)'
                            opacity = 0
                            pointerEvents = 'none'
                        }
                    }

                    return (
                        <section
                            key={section.id}
                            ref={(el) => (sectionRefs.current[section.id] = el)}
                            style={{
                                minHeight: 'auto',
                                padding: isMobile ? '0 1.5rem 2rem 1.5rem' : '0',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                scrollSnapAlign: 'none',
                                background: 'transparent',
                                overflow: 'visible',
                                boxSizing: 'border-box',
                                opacity: opacity,
                                transition: isMobile
                                    ? (isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out')
                                    : 'transform 0.25s ease-out, opacity 0.25s ease-out',
                                transform: transform,
                                width: '100%',
                                maxWidth: '100%',
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                bottom: 0,
                                top: isMobile ? 0 : 'auto',
                                height: isMobile ? '100%' : 'auto',
                                pointerEvents: pointerEvents
                            }}
                        >
                            {section.useBanner ? (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: isMobile ? '0.8rem' : '1.2rem',
                                    marginBottom: '0',
                                    width: '100%',
                                    maxWidth: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    <img
                                        src="/logo.png"
                                        alt="Archeum"
                                        style={{
                                            width: isMobile ? '40px' : '55px',
                                            height: isMobile ? '40px' : '55px'
                                        }}
                                    />
                                    <h1 style={{
                                        fontSize: isMobile ? '2.5rem' : '4rem',
                                        fontWeight: 500,
                                        margin: 0,
                                        letterSpacing: '0.05em',
                                        fontFamily: '"Gotham Medium", "Montserrat", system-ui, sans-serif',
                                        textTransform: 'uppercase',
                                        background: 'linear-gradient(135deg, #d8a941 0%, #b47a1a 55%, #5c3905 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        maxWidth: '100%'
                                    }}>
                                        ARCHEUM
                                    </h1>
                                </div>
                            ) : (
                                <>
                                    <h1 style={{
                                        fontSize: isMobile ? '2rem' : '3rem',
                                        fontWeight: 500,
                                        margin: 0,
                                        marginBottom: isMobile ? '0.75rem' : '1.3rem',
                                        letterSpacing: '0.05em',
                                        fontFamily: '"Gotham Medium", "Montserrat", system-ui, sans-serif',
                                        textTransform: 'uppercase',
                                        background: `linear-gradient(135deg, ${section.titleColor} 0%, ${darkenColor(section.titleColor, 75)} 100%)`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        transition: 'background 0.5s ease',
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                        maxWidth: '100%'
                                    }}>
                                        {section.title}
                                    </h1>
                                    <div style={{
                                        width: isMobile ? '60px' : '80px',
                                        height: isMobile ? '2px' : '3px',
                                        background: '#ffffff',
                                        marginBottom: isMobile ? '0' : '.3rem',
                                        transition: 'background 0.5s ease'
                                    }} />
                                </>
                            )}

                            <p style={{
                                fontSize: isMobile ? '1rem' : '1.5rem',
                                color: textColor,
                                opacity: 0.85,
                                fontWeight: 300,
                                lineHeight: 1.6,
                                marginBottom: isMobile ? '1.5rem' : '2rem',
                                maxWidth: '100%',
                                width: '100%',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                boxSizing: 'border-box'
                            }}>
                                {section.description}
                            </p>

                            {section.details && (
                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: 0,
                                    marginBottom: isMobile ? '1.5rem' : '2rem',
                                    maxWidth: isMobile ? '100%' : '600px',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}>
                                    {(isMobile ? section.details.slice(0, 3) : section.details).map((detail, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                fontSize: isMobile ? '0.95rem' : '1.1rem',
                                                color: textColor,
                                                opacity: 0.8,
                                                marginBottom: isMobile ? '0.75rem' : '1rem',
                                                paddingLeft: isMobile ? '1.25rem' : '1.5rem',
                                                position: 'relative',
                                                wordWrap: 'break-word',
                                                overflowWrap: 'break-word'
                                            }}
                                        >
                                            <span style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: isMobile ? '0.45rem' : '0.5rem',
                                                width: isMobile ? '5px' : '6px',
                                                height: isMobile ? '5px' : '6px',
                                                borderRadius: '50%',
                                                background: textColor
                                            }} />
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {(section.subtitle || (isMobile && section.id === 'intro')) && (
                                <p style={{
                                    color: textColor,
                                    fontSize: isMobile ? '0.8rem' : '0.9rem',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    opacity: 0.7,
                                    fontWeight: 600,
                                    transition: 'color 0.5s ease',
                                    margin: 0,
                                    marginBottom: isMobile && section.id === 'intro' ? '2rem' : 0,
                                    maxWidth: '100%',
                                    width: '100%',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    boxSizing: 'border-box'
                                }}>
                                    {isMobile && section.id === 'intro' ? 'Scroll to explore ↓' : section.subtitle}
                                </p>
                            )}
                        </section>
                    )
                })}

                {/* Mobile vertical progress indicator on right side */}
                {isMobile && (
                    <div style={{
                        position: 'fixed',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '4px',
                        height: '120px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '2px',
                        zIndex: 20,
                        pointerEvents: 'none',
                        opacity: isOnFinalPage ? 0 : 1,
                        transition: 'opacity 0.8s ease'
                    }}>
                        {/* Progress fill */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: `${((isOnFinalPage ? 4 : activeCardIndex) / 4) * 100}%`,
                            background: 'linear-gradient(180deg, #d8a941 0%, #b47a1a 55%, #5c3905 100%)',
                            borderRadius: '2px',
                            transition: 'height 0.3s ease-out',
                            boxShadow: '0 0 8px rgba(216, 169, 65, 0.4)'
                        }} />
                    </div>
                )}
            </div>
        </div>
    )
}

