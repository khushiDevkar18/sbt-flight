import { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

const Input = (props: Props) => <input {...props} />;

export default Input;

