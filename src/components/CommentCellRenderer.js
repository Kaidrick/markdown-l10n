import { ref, h } from 'vue'
import {VIcon} from 'vuetify/components'

export default {
    // props: {
    //     /* ... */
    // },
    setup(props) {
        const cellValue = props.params.valueFormatted
            ? props.params.valueFormatted
            : props.params.value;

        // return the render function
        if (cellValue) {
            return () => h(VIcon, { style: {position: 'absolute', top: '25%'} }, 'mdi-comment-outline')
        } else {

        }
    }
}
