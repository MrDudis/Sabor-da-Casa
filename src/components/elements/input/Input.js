import input from "@/components/elements/input/Input.module.css";

export function BasicInput({ name, label, placeholder, type, onChange, onBlur, defaultValue, error }) {

    return (
        <div className="w-full flex flex-col gap-1">
            <div className={input.basicInputDiv}>
                <input onChange={onChange} onBlur={onBlur} className={input.basicInput} style={error ? { borderColor: "red" } : null } id={name} name={name} type={type} placeholder={placeholder} defaultValue={defaultValue}></input>
                <label className={input.basicInputLabel} style={error ? { color: "red" } : null } htmlFor={name}>{label}</label>
            </div>
            <label className={`${error ? "block" : "hidden"} font-lgc text-sm text-red-500 fast-fade-in`} htmlFor={name}>{error}</label>
        </div>
    );

};

export function AdvancedInput({ name, label, type, onChange, onBlur, defaultValue, error, bgColor }) {

    return (
        <div className="w-full flex flex-col gap-1">
            <div className={input.advancedInputDiv}>
                <input onChange={onChange} onBlur={onBlur} className={input.advancedInput} style={error ? { borderColor: "red" } : null } id={name} name={name} type={type} placeholder=" " defaultValue={defaultValue}></input>
                <label className={input.advancedInputLabel} style={error ? { color: "red" } : null } htmlFor={name}><span className={`px-1 ${bgColor}`}>{label}</span></label>
            </div>
            <label className={`${error ? "block" : "hidden"} font-lgc text-sm text-red-500 fast-fade-in`} htmlFor={name}>{error}</label>
        </div>
    );

};

export function BasicSelect({ name, label, options, defaultValue }) {

    return (
        <div className={input.basicInputDiv}>
            <select className={input.basicSelect} id={name} name={name}>
                {
                    options.map((option, index) => {
                        return <option className={input.basicOption} value={option.value} selected={defaultValue == option.value ? "selected" : ""}>{option.label}</option>
                    })
                }
            </select>
            <label className={input.basicInputLabel} htmlFor={name}>{label}</label>
        </div>
    );

};

export function AdvancedSelect({ name, label, options, defaultValue, bgColor }) {

    return (
        <div className={input.advancedInputDiv}>
            <select className={input.advancedInput} style={{ height: "40px" }} id={name} name={name}>
                {
                    options.map((option, index) => {
                        return <option className={input.basicOption} value={option.value} selected={defaultValue == option.value ? "selected" : ""}>{option.label}</option>
                    })
                }
            </select>
            <label className={input.advancedInputLabel} htmlFor={name}><span className={`px-1 ${bgColor}`}>{label}</span></label>
        </div>
    );

};