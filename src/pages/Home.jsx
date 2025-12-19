import React from 'react'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <main className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
            {/* // <main className='min-h-screen bg-linear-to-r from-blue-400 to-purple-500 opacity-20'> */}
            <div div className=' flex justify-center gap-20' >
                <div className='mt-5'>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold pt-24">
                        <span className="text-white">Join Family</span>
                        <br />
                        <span className="bg-linear-to-r bg-clip-text text-transparent bg-[#ff5c00]" style={{ backgroundImage: 'linear-gradient(to right, rgb(59, 130, 246), rgb(6, 182, 212));', }}>Create Experience</span>
                    </h1>
                    <Link to={'bookings/'}>
                        <button className='font-bold text-amber-50 text-2xl bg-amber-700 mt-3 px-3 py-2 rounded hover:bg-blue-800 hover:cursor-pointer'>
                            Book <span className='text-green-500'>Now</span>
                        </button>
                    </Link>
                </div>
                <div className='mt-5'>

                    <img src="https://www.buildofy.com/blog/content/images/2022/06/_DSC9610-Edited_-min.jpg" alt="" className='h-80 w-96 object-cover rounded-2xl' />
                </div>
            </div >

            <section className="p-2">
                <p className="mb-3 text-amber-50 text-4xl font-bold">Insights of our home</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                    <div className="space-y-4">


                        <div className="grid grid-cols-2 gap-3">
                            <img
                                src="https://res.cloudinary.com/dw4e01qx8/f_auto,q_auto/images/c0kbttkjbzi4t45fufle"
                                className="rounded-lg w-full h-auto object-cover"
                                alt=""
                            />
                            <img
                                src="https://res.cloudinary.com/dw4e01qx8/f_auto,q_auto/images/c0kbttkjbzi4t45fufle"
                                className="rounded-lg w-full h-auto object-cover"
                                alt=""
                            />

                        </div>


                        <div className="grid grid-cols-2 gap-3">
                            <img
                                src="https://www.mymodernhome.com/media/images/MMH-No23-3840x2160_.e6f02ed0.fill-1920x1080.format-webp.webp"
                                className="rounded-lg w-full h-auto object-cover"
                                alt=""
                            />
                            <img
                                src="https://www.mymodernhome.com/media/images/MMH-No23-3840x2160_.e6f02ed0.fill-1920x1080.format-webp.webp"
                                className="rounded-lg w-full h-auto object-cover"
                                alt=""
                            />
                        </div>

                    </div>


                    <div>
                        <img
                            src="https://www.mymodernhome.com/media/images/MMH-No23-3840x2160_.e6f02ed0.fill-1920x1080.format-webp.webp"
                            className="rounded-lg w-full h-auto object-cover"
                            alt=""
                        />
                    </div>

                </div>
            </section>

            <Footer />
        </main >
    )
}

export default Home