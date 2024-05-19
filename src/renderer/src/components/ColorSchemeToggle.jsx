import { DarkModeRounded, LightMode } from "@mui/icons-material"
import { IconButton } from "@mui/joy"
import { useColorScheme } from "@mui/joy/styles"
import * as React from "react"

export default function ColorSchemeToggle(props) {
    const { onClick, sx, ...other } = props
    const { mode, setMode } = useColorScheme()
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) {
        return (
            <IconButton
                size="sm"
                variant="outlined"
                color="neutral"
                {...other}
                sx={sx}
                disabled
            />
        )
    }
    return (
        <IconButton
            id="toggle-mode"
            size="sm"
            variant="outlined"
            color="neutral"
            {...other}
            onClick={event => {
                if (mode === "light") {
                    setMode("dark")
                } else {
                    setMode("light")
                }
                onClick?.(event)
            }}
            sx={[
                {
                    "& > *:first-of-type": {
                        display: mode === "dark" ? "none" : "initial"
                    },
                    "& > *:last-of-type": {
                        display: mode === "light" ? "none" : "initial"
                    }
                },
                ...(Array.isArray(sx) ? sx : [sx])
            ]}
        >
            <DarkModeRounded />
            <LightMode />
        </IconButton>
    )
}
