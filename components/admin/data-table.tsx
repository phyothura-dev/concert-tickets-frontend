import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface ColumnDef<TData> {
  header: React.ReactNode;
  accessorKey?: keyof TData;
  cell?: (item: TData) => React.ReactNode;
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  keyExtractor: (item: TData) => string;
  emptyMessage?: string;
}

export function DataTable<TData>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No results.",
}: DataTableProps<TData>) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <Table>
        <TableHeader className="bg-zinc-50/50">
          <TableRow className="hover:bg-transparent">
            {columns.map((col, i) => (
              <TableHead 
                key={i}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow 
                key={keyExtractor(item)}
                className="hover:bg-zinc-50/50 transition-colors"
              >
                {columns.map((col, i) => (
                  <TableCell key={i}>
                    {col.cell 
                      ? col.cell(item) 
                      : col.accessorKey 
                        ? (item[col.accessorKey] as React.ReactNode)
                        : null
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
