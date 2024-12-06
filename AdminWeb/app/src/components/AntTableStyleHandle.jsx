import { createStyles } from "antd-style";

export const useCustomTableStyle = createStyles(({ css, token }) => {
	const { antCls } = token;
	return {
		customTable: css`
			${antCls}-table {
				${antCls}-table-container {
					${antCls}-table-body,
					${antCls}-table-content {
						scrollbar-width: thin;
						scrollbar-color: #eaeaea transparent;
						scrollbar-gutter: stable;
					}
				}
			}
		`,
	};
});
