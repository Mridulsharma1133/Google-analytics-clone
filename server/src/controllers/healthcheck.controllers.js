const healthcheck = async(req, res) => {
   return res.status(200).json({
        status: "OK",
        message: "Api is working"
    })
}
export default healthcheck