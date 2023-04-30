import styles from "@/styles/Index.module.css";

function ReviewStar() {

    return (
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20" className="fill-yellow-400">
            <path d="M286.283 941.696q-14.913 11.195-29.587.5-14.674-10.696-9.196-27.848l73.478-240.196-191.674-136.956q-14.674-10.435-8.956-27.848 5.717-17.413 23.869-17.413h236.196l75.717-251.913q2.479-8.718 9.196-12.816 6.717-4.097 14.674-4.097t14.554 4.097q6.598 4.098 9.076 12.816l75.957 251.913h236.196q18.152 0 23.869 17.413 5.718 17.413-8.956 27.848L639.022 674.152l73.717 240.196q5.479 17.152-9.076 27.848-14.554 10.695-29.467-.5L480.239 793.978 286.283 941.696Z"/>
        </svg>
    );

};

function ReviewBox({ review }) {

    return (
        <div className="w-[100%] lg:w-[45%] max-w-[768px] lg:max-w-xl h-fit rounded-lg bg-white">

            <div className="flex flex-col justify-center items-start gap-2 px-7 py-5">

                <div className="flex flex-row w-full justify-between items-center">

                    <div>
                        <h2 className="font-lgc font-bold text-neutral-800 text-md">{review.author}</h2>
                    </div>

                    <div className="flex flex-row gap-[1px]">

                        {
                            [...Array(review.rate)].map((star, index) => {
                                return <ReviewStar key={index}></ReviewStar>
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

export default function ReviewsSection({ reviews }) {
    
    return (
        <div className={styles.reviewsBackground} id="avaliacoes">

            <div className="w-full" style={{ background: "rgba(0, 0, 0, 0.8)" }}>

                <div className="flex flex-col justify-center items-center pt-32 pb-44 gap-12">

                    <div className="flex flex-row items-center gap-3 sm:gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" className="fill-white h-12 sm:h-14">
                            <path d="M440 601.667Zm-206 343q-9.667 7.666-19.5.666-9.833-6.999-6.167-18.999L286 672 82.333 526q-10-6.667-6.167-18.333Q80 496 92 496h252l80.333-266.667q2-6 6.167-9t9.5-3q5.333 0 9.5 3t6.167 9L536 496h252q12 0 15.834 11.667 3.833 11.666-6.167 18.333L594 672l77.667 254.334q3.666 12-6.167 18.999-9.833 7-19.5-.666L440 788 234 944.667Zm82.666-148.666L440 702l123.334 94.001L514.667 640l114.001-76H490.667L440 407.332 389.333 564H251.332l114.001 76-48.667 156.001ZM798.667 944 749 905.667 686.667 704l144-102.667H893q12 0 16 11.667 4 11.666-6 18.333l-138.334 99.334L825.333 926q3.667 12-6.667 18.833-10.333 6.834-19.999-.833ZM596 416l-30-102 25.333-84.667q2-6 6.167-9.167Q601.667 217 607 217t9.833 3.333q4.5 3.333 6.5 9L680 416h-84Z"/>
                        </svg>
                        <h1 className="font-sinoreta text-white text-center text-5xl sm:text-6xl">Avaliações</h1>
                    </div>

                    <div className="w-full max-w-[1800px] flex flex-row justify-center gap-12 lg:gap-12 px-[5%] flex-wrap">

                            {
                                reviews.map((review, index) => {
                                    return (
                                        <ReviewBox key={index} review={review}></ReviewBox>
                                    );
                                })
                            }

                    </div>

                </div>

            </div>

        </div>
    );

};