export const ColorConfiguration = () => {
    return (
        <>
            <h3 className=" text-black text-xl font-semibold mt-8 dark:text-white" >Colors</h3>
            <div className="p-6 rounded-md border mt-4 border-border dark:border-dark_border">
                <p className="text-base font-medium text-midnight_text dark:text-grey" ><span className="font-semibold text-lg dark:text-white">1. Override Colors</span> <br />
                    For any change in colors : src/utils/extendedConfig.ts</p>
                <div className="py-4 px-5 rounded-md bg-black mt-8">
                    <p className="text-sm text-gray-400 flex flex-col gap-2">
                        <span>dark_black: "#0C0B10",</span>
                        <span>purple_blue: "#4E29FF",</span>
                        <span>purple: "#F0EDFF",</span>
                        <span>blue: "#D3D546",</span>
                        <span>orange: "#FC7035",</span>
                        <span>green: "#6DA951",</span>
                        <span>pink: "#FCEE28",</span>
                        <span>blue_gradient: "#F0EDFF",</span>
                        <span>yellow_gradient: "#FCEE28",</span>
                        <span>paleYellow: "#FCEE28",</span>
                        <span>dark_yellow_gradient: "#6DA951",</span>
                        <span>dark_blue_gradient: "#0C0B10"</span>
                    </p>
                </div>
            </div>
            <div className="p-6 rounded-md border mt-4 border-border dark:border-dark_border">
                <p className="text-base font-medium text-midnight_text dark:text-grey" ><span className="font-semibold text-lg dark:text-white">2. Override Theme Colors</span> <br />
                    For change , go to : src/utils/extendedConfig.ts</p>
                <div className="py-4 px-5 rounded-md bg-black mt-8">
                    <p className="text-sm text-gray-400 flex flex-col gap-2">
                        <span>dark_black: "#0C0B10",</span>
                        <span>purple_blue: "#4E29FF",</span>
                    </p>
                </div>
            </div>
        </>
    )
}