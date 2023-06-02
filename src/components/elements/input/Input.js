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

export function FilterInput({ name, label, placeholder, defaultValue, onChange, onBlur, bgColor }) {

    return (
        <div className="w-full flex flex-col gap-1">
            <div className={input.advancedInputDiv}>
                <input onChange={({ target }) => { target.value = onChange(target.value); }} onBlur={({ target }) => { target.value = onBlur(target.value); }} className={input.filterInput} id={name} name={name} type="text" placeholder=" " defaultValue={defaultValue}></input>
                <label className={input.advancedInputLabel} htmlFor={name}><span className={`px-1 ${bgColor}`}>{label}</span></label>
            </div>
        </div>
    );

};

export function BasicSelect({ name, label, options, defaultValue, onChange, error }) {

    return (
        <div className="w-full flex flex-col gap-1">
            <div className={input.basicInputDiv}>
                <select onChange={onChange} className={input.basicSelect} style={error ? { borderColor: "red" } : null } id={name} name={name}>
                    {
                        options.map((option, index) => {
                            return <option className={input.basicOption} value={option.value} selected={defaultValue == option.value ? "selected" : ""}>{option.label}</option>
                        })
                    }
                </select>
                <label className={input.basicInputLabel} style={error ? { color: "red" } : null } htmlFor={name}>{label}</label>
            </div>
            <label className={`${error ? "block" : "hidden"} font-lgc text-sm text-red-500 fast-fade-in`} htmlFor={name}>{error}</label>
        </div>
    );

};

export function AdvancedSelect({ name, label, options, defaultValue, onChange, error, bgColor }) {

    return (
        <div className="w-full flex flex-col gap-1">
            <div className={input.advancedInputDiv}>
                <select className={input.advancedInput} onChange={onChange} style={error ? { borderColor: "red", height: "40px" } : { height: "40px" } } id={name} name={name}>
                    {
                        options.map((option, index) => {
                            return <option className={input.basicOption} value={option.value} selected={defaultValue == option.value ? "selected" : ""}>{option.label}</option>
                        })
                    }
                </select>
                <label className={input.advancedInputLabel} style={error ? { color: "red" } : null } htmlFor={name}><span className={`px-1 ${bgColor}`}>{label}</span></label>
            </div>
            <label className={`${error ? "block" : "hidden"} font-lgc text-sm text-red-500 fast-fade-in`} htmlFor={name}>{error}</label>
        </div>
    );

};

export function FilterRadioInput({ name, options, defaultValue }) {

    return (
        <>
            { 
                options.map((option, index) => {
                    return (
                        <label class="inline-flex items-center" index={index}>
                            <input type="radio" class="font-lgc h-5 w-5 text-black border border-gray-300" name={name} value={option?.value}></input>
                            <span class="ml-2 font-lgc text-gray-700">{option?.label}</span>
                        </label>
                    );
                })
            }
        </>
    );

};

export function FilterCheckboxInput({ name, options, defaultValue }) {

    return (
        <>
            { 
                options.map((option, index) => {
                    return (
                        <label class="inline-flex items-center" index={index}>
                            <input type="checkbox" class="font-lgc h-4 w-4 text-black border border-gray-300" name={option?.name} value={option?.value}></input>
                            <span class="ml-2 font-lgc text-gray-700">{option?.label}</span>
                        </label>
                    );
                })
            }
        </>
    );

};