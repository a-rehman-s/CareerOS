import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, error, required, hint, className, children }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full px-3.5 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
        error ? "border-destructive" : "border-input",
        className
      )}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ className, error, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full px-3.5 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm transition-colors resize-none",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
        error ? "border-destructive" : "border-input",
        className
      )}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options: { value: string; label: string }[];
}

export function Select({ className, error, options, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full px-3.5 py-2.5 rounded-lg border bg-background text-foreground text-sm transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
        error ? "border-destructive" : "border-input",
        className
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

interface CheckboxFieldProps {
  label: string;
  name: string;
  defaultChecked?: boolean;
  description?: string;
}

export function CheckboxField({ label, name, defaultChecked, description }: CheckboxFieldProps) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer group">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultChecked}
        className="mt-0.5 w-4 h-4 rounded border-input text-primary focus:ring-ring"
      />
      <div>
        <span className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors">
          {label}
        </span>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    </label>
  );
}
