import { deep } from '@theme-ui/presets'

const theme = {
    ...deep,
    containers: {
        courseInfo: {
            margin: 'auto',
            p: 2,
            width: '75%',
            maxWidth: '650px',
            textAlign: 'center'
        },
        courseInfoDescription: {
            textAlign: 'justify'
        },
        page: {
            width: '100%',
            maxWidth: '960px',
            m: 0,
            mx: 'auto',
        },
    },
    styles: {
        ...deep.styles
    }
}

export default theme