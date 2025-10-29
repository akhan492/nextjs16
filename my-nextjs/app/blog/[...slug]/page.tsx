 const Blog = async (props:any)=>{

    const {slug}  = await props.params;


    return (
        <>
        <h1>this is blog {slug[0]} {slug[1]}</h1>
        </>
    )
}
export default Blog