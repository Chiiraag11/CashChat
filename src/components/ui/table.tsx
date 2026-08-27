import { cn } from '@/lib/utils';
import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full text-sm', className)} {...props} />
    </div>
  );
}
export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('border-b text-left text-xs uppercase tracking-wide text-muted-foreground', className)} {...props} />;
}
export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y', className)} {...props} />;
}
export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('transition hover:bg-muted/50', className)} {...props} />;
}
export function TableHeadCell({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('px-3 py-2 font-medium', className)} {...props} />;
}
export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-3 py-3', className)} {...props} />;
}
