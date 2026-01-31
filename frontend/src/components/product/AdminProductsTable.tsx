import { DollarSign } from 'lucide-react';
import type { ProductAdmin } from '../../types/product.types';

const AdminProductsTable = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="border border-primary/10 rounded-lg overflow-hidden text-white!">
			<div className="overflow-x-auto">
				<table className="w-full table-fixed">
					<thead className="bg-primary/5 border-b border-primary/10">
						<tr>
							<th className="px-4 py-3 text-left text-sm font-semibold text-primary w-auto">Name</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-primary w-auto">Prices</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-primary w-auto">Short Description</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-primary w-auto">Images</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-primary w-auto">Stock</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-primary w-auto">View Count</th>
							<th className="px-4 py-3 text-left text-sm font-semibold text-primary w-auto">Sales Count</th>
							{/* <th className="px-4 py-3 text-center text-sm font-semibold text-primary w-32 xl:w-40 sticky right-0 bg-primary/5">
								Actions
							</th> */}
						</tr>
					</thead>
					<tbody className="divide-y divide-primary/10">{children}</tbody>
				</table>
			</div>
		</div>
	);
};

interface TableItemProps {
	product: ProductAdmin | null;
	onEdit?: () => void;
	onDelete?: () => void;
}

export const TableItem = ({ product, onEdit, onDelete }: TableItemProps) => {
	if (!product) {
		return <div>No product available</div>;
	}

	const {
		name,
		slug,
		sku,
		price,
		comparePrice,
		cost,
		shortDescription,
		isFeatured,
		images,
		averageRating,
		category,
		stock,
		lowStockThreshold,
		trackInventory,
		isActive,
		viewCount,
		salesCount,
	} = product;

	// const formatDate = (date) => {
	// 	if (!date) return null;
	// 	try {
	// 		return format(new Date(date), 'MMM dd, yyyy');
	// 	} catch {
	// 		return null;
	// 	}
	// };

	return (
		<tr className="hover:bg-primary/5 transition-colors">
			<td className="px-4 py-4">
				<div className="flex flex-col">
					<span className="font-medium text-primary">{name}</span>
					{/* {job_url && (
						<a
							href={job_url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-1"
						>
							<ExternalLink className="size-3 transform translate-z-0 backface-hidden will-change-auto" />
							View posting
						</a>
					)} */}
				</div>
			</td>

			<td className="px-4 py-4">
				<div className="flex flex-col gap-1 text-sm text-primary/80">
					{price && (
						<div className="flex items-center gap-1">
							<DollarSign className="size-3 transform translate-z-0 backface-hidden will-change-auto" />
							<span className="text-xs">{price}</span>
						</div>
					)}
					{comparePrice && (
						<div className="flex items-center gap-1">
							<DollarSign className="size-3 transform translate-z-0 backface-hidden will-change-auto" />
							<span className="text-xs">{comparePrice}</span>
						</div>
					)}
					{cost && (
						<div className="flex items-start gap-1 mt-1">
							<DollarSign className="size-3 mt-0.5 shrink-0 transform translate-z-0 backface-hidden will-change-auto" />
							<span className="text-xs line-clamp-2">{cost}</span>
						</div>
					)}
				</div>
			</td>

			<td className="px-4 py-4">
				<span className="text-primary">{shortDescription}</span>
			</td>

			<td className="px-4 py-4">
				<span className="text-primary">images</span>
			</td>

			<td className="px-4 py-4">
				<span className="text-primary">{stock}</span>
			</td>

			<td className="px-4 py-4">
				<span className="text-primary">{viewCount}</span>
			</td>

			<td className="px-4 py-4">
				<span className="text-primary">{salesCount}</span>
			</td>

			{/* <td className="px-4 py-4">
				<span
					className={`inline-flex px-2 py-1 w-18 justify-center rounded-lg text-xs font-medium ${getStatusColor(
						status,
					)}`}
				>
					{status}
				</span>
			</td> */}

			{/* <td className="px-4 py-4">
				<div className="flex flex-col gap-1 text-sm text-primary/80">
					{location && (
						<div className="flex items-center gap-1">
							<MapPin className="size-3 transform translate-z-0 backface-hidden will-change-auto" />
							<span className="text-xs">{location}</span>
						</div>
					)}
					{salary_range && (
						<div className="flex items-center gap-1">
							<DollarSign className="size-3 transform translate-z-0 backface-hidden will-change-auto" />
							<span className="text-xs">{salary_range}</span>
						</div>
					)}
					{notes && (
						<div className="flex items-start gap-1 mt-1">
							<FileText className="size-3 mt-0.5 shrink-0 transform translate-z-0 backface-hidden will-change-auto" />
							<span className="text-xs line-clamp-2">{notes}</span>
						</div>
					)}
				</div>
			</td> */}

			{/* <td className="px-4 py-4">
				<div className="flex flex-col gap-1 text-sm text-primary/80">
					<div className="flex items-center gap-1">
						<Calendar className="size-3 transform translate-z-0 backface-hidden will-change-auto" />
						<span className="text-xs">{formatDate(applied_date)}</span>
					</div>
					{deadline && (
						<div className="flex items-center gap-1 text-red-600">
							<Calendar className="size-3 transform translate-z-0 backface-hidden will-change-auto" />
							<span className="text-xs">Due: {formatDate(deadline)}</span>
						</div>
					)}
				</div>
			</td> */}

			{/* <td className="px-4 py-4 sticky right-0 bg-background/50">
				<div className="flex items-center justify-center gap-1">
					<Button
						onClick={onEdit}
						className="text-primary/80 transition-colors rounded-full! hover:bg-primary/10"
						variant="icon"
						title="Edit application"
					>
						<Edit className="size-4 transform translate-z-0 backface-hidden will-change-auto" />
					</Button>
					<Button
						onClick={onDelete}
						className="text-red-600 transition-colors rounded-full! hover:bg-primary/10"
						variant="icon"
						title="Delete application"
					>
						<Trash2 className="size-4" />
					</Button>
				</div>
			</td> */}
		</tr>
	);
};

export default AdminProductsTable;
