import DiceLoader from "../loaders/dice";
import Fallback from "../not-found/fallback";
type DataStateProps<T> = {
  data: T | null;
  loading: boolean;
  error: any;
  refetch?: () => void;
  LoadingComponent?: React.ComponentType;
  ErrorComponent?: React.ComponentType<{ error: any; onRetry?: () => void }>;
  EmptyComponent?: React.ComponentType;
  children: (data: T) => React.ReactNode;
  isEmpty?: (data: T) => boolean;
  validate?: (data: T) => { isValid: boolean; error?: any };
};

/**
 * `DataState`
 *
 * A utility component that handles common data-fetching states:
 * - **Loading:** Shows a loading indicator.
 * - **Error:** Displays an error fallback with a retry option.
 * - **Empty:** Renders an empty state if data is missing or invalid.
 * - **Valid Data:** Renders the provided children with data.
 *
 * @template T - The type of data being handled.
 * @param {T | null} data - The fetched data.
 * @param {boolean} loading - Whether the data is still loading.
 * @param {any} error - The error object if the fetch failed.
 * @param {() => void} [refetch] - Function to retry fetching data.
 * @param {React.ComponentType} [LoadingComponent=Loader] - Component to show while loading.
 * @param {React.ComponentType<{ error: any; onRetry?: () => void }>} [ErrorComponent=Fallback] - Component to show on error.
 * @param {React.ComponentType} [EmptyComponent=Fallback] - Component to show when data is empty.
 * @param {(data: T) => React.ReactNode} children - Render function for valid data.
 * @param {(data: T) => boolean} [isEmpty] - Function to determine if the data should be treated as empty.
 * @param {(data: T) => { isValid: boolean; error?: any }} [validate] - Function to validate the data.
 *
 * @example
 * ```tsx
 * <DataState
 *   data={data}
 *   loading={isLoading}
 *   error={fetchError}
 *   refetch={fetchUserData}
 * >
 *   {(data) => <ListingCard listing={data.listing} />}
 * </DataState>
 * ```
 */

export default function DataState<T>({
  data,
  loading,
  error,
  refetch,
  LoadingComponent = DiceLoader,
  ErrorComponent = Fallback,
  EmptyComponent = Fallback,
  children,
  isEmpty = (data) => !data || (Array.isArray(data) && data.length === 0),
  validate,
}: DataStateProps<T>) {
  if (loading) return <LoadingComponent />;

  if (error) {
    return <ErrorComponent error={error} onRetry={refetch} />;
  }

  if (isEmpty(data)) {
    return <EmptyComponent />;
  }

  if (validate) {
    const validationResult = validate(data);
    if (!validationResult.isValid) {
      return (
        <ErrorComponent
          error={
            validationResult.error || { status: 400, message: "Invalid data" }
          }
          onRetry={refetch}
        />
      );
    }
  }

  return <>{children(data)}</>;
}
