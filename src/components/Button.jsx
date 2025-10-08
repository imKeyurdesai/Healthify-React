import React,{useRef} from 'react'

function Button({
    label = "click me",
    className = '',
    ...props
}, ref) {
    ref = useRef(null);
return (
    <button className={`bg-white hover:bg-blue-100 text-blue-600 font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1  ${className}`} {...props} ref={ref}>
            {label}
    </button>
)
}

export default React.forwardRef(Button)
