import csvParse from "csv-parse";
import fs from "fs";

interface CSVData {
  Conta: string;
  Descricao: string;
  Saldo_anterior: string;
  Debito: string;
  Credito: string;
  Mov_periodo: string;
  Saldo_atual: string;
  Ok: string;
}

class ImportCSVService {
  async execute(filePath: string): Promise<CSVData[]> {
    const contactsReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    const data: CSVData[] = [];

    parseCSV.on("data", async (line) => {
      let [
        Conta,
        Descricao,
        Saldo_anterior,
        Debito,
        Credito,
        Mov_periodo,
        Saldo_atual,
        Ok,
      ] = line.map((cell: string) => cell.trim());

      if(!Conta || Conta === '-') return;

      // SALDO ANTERIOR FORMATTER
      if (!/\d/.test(Saldo_anterior)) {
        Saldo_anterior = "0";
      } else {
        if (Saldo_anterior.includes("D")) {
          const value = `-${Saldo_anterior}`;
          Saldo_anterior = value.split("D").join("");
        } else if (Saldo_anterior.includes("C")) {
          Saldo_anterior = Saldo_anterior.split("C").join("");
        }
        Saldo_anterior = Saldo_anterior.split(".").join("").trim();
      }

      // DEBITO FORMATTER
      if (!/\d/.test(Debito)) {
        Debito = "0";
      } else {
        Debito = Debito.split("R$").join("");
        Debito = Debito.split(",").join("");
        Debito = Debito.split(" ").join("");
        Debito = Debito.split(".").join(",").trim();
      }

      // CREDITO FORMATTER
      if (!/\d/.test(Credito)) {
        Credito = "0";
      } else {
        Credito = Credito.split("R$").join("");
        Credito = Credito.split(",").join("");
        Credito = Credito.split(" ").join("");
        Credito = Credito.split(".").join(",").trim();
      }

      // MOV PERIODO FORMATTER
      if (!/\d/.test(Mov_periodo)) {
        Mov_periodo = "0";
      } else {
        if (Mov_periodo.includes("D")) {
          const value = `-${Mov_periodo}`;
          Mov_periodo = value.split("D").join("");
        } else if (Mov_periodo.includes("C")) {
          Mov_periodo = Mov_periodo.split("C").join("");
        }
        Mov_periodo = Mov_periodo.split(".").join("").trim();
      }

      // SALDO ATUAL FORMATTER
      if (!/\d/.test(Saldo_atual)) {
        Saldo_atual = "0";
      } else {
        if (Saldo_atual.includes("D")) {
          const value = `-${Saldo_atual}`;
          Saldo_atual = value.split("D").join("");
        } else if (Saldo_atual.includes("C")) {
          Saldo_atual = Saldo_atual.split("C").join("");
        }
        Saldo_atual = Saldo_atual.split(".").join("").trim();
      }

      data.push({
        Conta,
        Descricao,
        Saldo_anterior,
        Debito,
        Credito,
        Mov_periodo,
        Saldo_atual,
        Ok,
      });
    });

    await new Promise((resolve) => {
      parseCSV.on("end", resolve);
    });

    await fs.promises.unlink(filePath);

    return data;
  }
}

export default ImportCSVService;
