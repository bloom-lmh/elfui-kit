// elf-alert 类型

export type AlertType = "info" | "success" | "warning" | "danger";

export type AlertVariant = "tonal" | "elevated" | "outlined" | "plain" | "filled";

export type AlertDensity = "default" | "compact";

export interface AlertProps {
    type: AlertType;
    variant: AlertVariant;
    title: string;
    description: string;
    closable: boolean;
    closeText: string;
    showIcon: boolean;
    center: boolean;
    density: AlertDensity;
    prominent: boolean;
}
