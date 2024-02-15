import React from 'react';


export default function Stylus() {
    

    return (
                <div className='w-[160px] h-[400px] bg-[rgb(31,31,32)] rounded-md flex flex-row justify-center border border-[rgb(54,54,54)] absolute top-[20%] left-2' >
                    <div className='rounded-sm flex-row cursor-default p-2'>
                        <div className='brushes w-[140px] h-[130px] rounded-sm flex-row cursor-default'>
                            <div className='title text-white font-light h-5 flex ml-3'><img className='mt-[3px] mr-[3px]' src="/icons8-options-24.png" width={20}
                                height={20} alt="[]" />Options</div>
                            <div className='flex-row p-3'>
                                <div className='pointer text-white font-thin h-6 m-2 flex hov cursor-pointer active tool option' id='pointer'><img className='m-[3px] mr-2' src="/icons8-cursor-30.png" width={18}
                                    height={18} alt="[]" />Pointer</div>
                                <div className='brush text-white font-thin h-6 m-2 flex hov cursor-pointer  tool option' id='brush'><img className='m-[3px] mr-2' src="/icons8-brush-64.png" width={18}
                                    height={18} alt="[]" />Brush</div>
                                <div className='Eraser text-white font-thin h-6 m-2 flex hov cursor-pointer tool option' id='eraser'><img className='m-[3px] mr-2' src="/icons8-eraser-24.png" width={18}
                                    height={18} alt="[]" />Eraser</div>
                            </div>
                        </div>
                        <div className='range w-[140px] h-[35px] rounded-sm flex-row cursor-default ml-3'>
                            <input type='range' id='size-slider' className='size h-1' min="1" max="30" defaultValue={2}/>
                            <label htmlFor="size-slider" className='text-white font-thin'></label>
                        </div>
                        <div className='color w-[150px] h-[75px] rounded-sm flex-row cursor-default'>
                            <label className='title text-white font-light h-6 flex ml-3'><img className='mt-[3px] mr-[3px]' src="/icons8-color-50.png" width={20}
                                height={20} alt="[]" />Colors</label>
                            <div className='flex justify-between p-3'>
                                <div className='h-5 w-5 bg-black m-1 rounded-xl  colors selected cursor-pointer' id='rgb(255 255 255'></div>
                                <div className='h-5 w-5 bg-blue-600 m-1 rounded-xl colors cursor-pointer' id='rgb(37 99 235)'></div>
                                <div className='h-5 w-5 bg-red-600 m-1 rounded-xl colors cursor-pointer' id='rgb(220 38 38)'></div>
                                <div className='h-5 w-5 bg-green-600 m-1 rounded-xl colors cursor-pointer' id='rgb(22 163 74)'></div>
                            </div>

                        </div>
                        <div className='w-[160px] h-[100px] rounded-sm grid cursor-default justify-center items-center'>
                            <button className='title text-white h-6 flex bg-blue-700 rounded-md w-[110px] justify-center font-thin clear-canvas hover:bg-blue-800'>Clear Canvas</button>
                            <button id='capture' className='title text-white h-6 flex bg-blue-700 rounded-md w-[110px] justify-center font-thin hover:bg-blue-800 capture'>Save as pdf</button>
                        </div>
                    </div>

                </div>

    );
}
