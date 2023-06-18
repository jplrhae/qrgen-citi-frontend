import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TableVirtuoso, TableComponents } from "react-virtuoso";
import { Alert, Button, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

interface IBillingFileRecord {
  Status: string;
  Cpf: string;
  Name: string;
  CreatedDate: string;
}

interface ColumnData {
  dataKey: keyof IBillingFileRecord;
  label: string;
  numeric?: boolean;
  width: number;
}

const columns: ColumnData[] = [
  {
    width: 200,
    label: "Status",
    dataKey: "Status",
  },
  {
    width: 200,
    label: "CPF/CNPJ",
    dataKey: "Cpf",
  },
  {
    width: 120,
    label: "Nome devedor",
    dataKey: "Name",
  },
  {
    width: 120,
    label: "Data de processamento",
    dataKey: "CreatedDate",
  },
];

const VirtuosoTableComponents: TableComponents<IBillingFileRecord> = {
  Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table
      {...props}
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? "right" : "left"}
          style={{ width: column.width }}
          sx={{
            backgroundColor: "background.paper",
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index: number, row: IBillingFileRecord) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? "right" : "left"}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function FilesTable() {
  const [files, setFiles] = React.useState<IBillingFileRecord[]>([]);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>(null);

  React.useEffect(() => {
    fetchBillingFiles();
  }, []);

  const fetchBillingFiles = async () => {
    setIsLoaded(false);
    try {
      const response = await fetch("http://localhost:8080/historic");
      const data = await response.json();
      data.forEach((file: IBillingFileRecord) => {
        file.CreatedDate = new Date(file.CreatedDate).toUTCString();
      });
      console.log("Data from server: ", data);
      setFiles(data);
      setIsLoaded(true);
    } catch (error) {
      setError(error);
    }
  };

  if (!isLoaded) {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Houve um erro ao carregar os arquivos. Tente novamente.
      </Alert>
    );
  }

  return (
    <>
      <Paper style={{ width: "100%", height: "600px" }}>
        <TableVirtuoso
          data={files}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      </Paper>
      <Button
        onClick={fetchBillingFiles}
        variant="outlined"
        sx={{ marginTop: "6px" }}
      >
        <RefreshIcon />
      </Button>
    </>
  );
}
