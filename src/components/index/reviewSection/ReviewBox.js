import ReviewStar from "./ReviewStar";

export default function ReviewBox({ review }) {

    return (
        <div className="w-[100%] lg:w-[45%] max-w-[768px] lg:max-w-xl h-fit rounded-lg bg-white">
                            
            <div className="flex flex-col justify-center items-start gap-2 px-6 py-4">

                <div className="flex flex-row w-full justify-between items-center">

                    <div>
                        <h2 className="font-lgc font-bold text-neutral-800 text-md">{review.author}</h2>
                    </div>

                    <div className="flex flex-row gap-[1px]">

                        {
                            [...Array(review.rate)].map((star, index) => {
                                return <ReviewStar></ReviewStar>
                            })
                        }
                        
                    </div>

                </div>

                <div>
                    <p className="font-lgc text-neutral-900 text-md">{review.description}</p>
                </div>

            </div>

        </div>
    );

};