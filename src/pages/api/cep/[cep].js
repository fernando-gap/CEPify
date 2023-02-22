// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios"

export default async function handler(req, res) {
    const { cep } = req.query
    if (cep.length > 8 || !/^[0-9]*$/.test(cep)) {
        res.status(400).json({code: 400, error: `CEP Inválido: "${cep}"`});
    } else {
        const url = `https://viacep.com.br/ws/${cep}/json`
        const response = await axios.get(url)

        if (response.data.erro) {
            res.status(400).json({code: 400, error: `CEP Inválido: "${cep}"`});
        } else {
            res.status(200).json(response.data)
        }
    }
}
